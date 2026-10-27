<?php
declare(strict_types=1);

// Contact form handler for ai-ulu.com. Accepts JSON POST from app.js,
// stores every lead on disk and emails it to the inbox below.

const INBOX = 'aliulu@ai-ulu.com';
const SENDER = 'form@ai-ulu.com';
const LEAD_DIR = __DIR__ . '/leads';
const MAX_PER_HOUR = 5;

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method']);
    exit;
}

$raw = file_get_contents('php://input');
if ($raw === false || $raw === '' || strlen($raw) > 20000) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'payload']);
    exit;
}

$data = json_decode($raw, true);
if (!is_array($data)) {
    $data = $_POST;
}

$field = static function (string $key, int $max) use ($data): string {
    $value = is_string($data[$key] ?? null) ? $data[$key] : '';
    $value = preg_replace('/[\x00-\x1F\x7F]+/', ' ', $value);
    return mb_substr(trim((string) $value), 0, $max);
};

$name  = $field('name', 120);
$reach = $field('reach', 160);
$type  = $field('type', 40);
$msg   = $field('msg', 4000);
$honey = $field('website', 100);

// Honeypot: a real visitor never fills this. Report success so the bot moves on.
if ($honey !== '') {
    echo json_encode(['ok' => true]);
    exit;
}

if ($name === '' || $reach === '') {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'required']);
    exit;
}

$labels = ['site' => 'Website', 'app' => 'App', 'both' => 'Site + app', 'unsure' => 'Not sure yet'];
if (!isset($labels[$type])) {
    $type = 'unsure';
}

$leadDir = LEAD_DIR;
if (!is_dir($leadDir) && !@mkdir($leadDir, 0700, true) && !is_dir($leadDir)) {
    $leadDir = sys_get_temp_dir();
}

$ip = (string) ($_SERVER['REMOTE_ADDR'] ?? '0');
$now = time();
$rateFile = $leadDir . '/rl-' . substr(hash('sha256', $ip), 0, 16) . '.txt';
$hits = [];
if (is_file($rateFile)) {
    $hits = array_filter(
        array_map('intval', explode(',', (string) @file_get_contents($rateFile))),
        static fn (int $t): bool => $t > $now - 3600
    );
}
if (count($hits) >= MAX_PER_HOUR) {
    http_response_code(429);
    echo json_encode(['ok' => false, 'error' => 'rate']);
    exit;
}
$hits[] = $now;
@file_put_contents($rateFile, implode(',', $hits), LOCK_EX);

$stamp = gmdate('c');
$record = [
    'at' => $stamp,
    'ip' => $ip,
    'name' => $name,
    'reach' => $reach,
    'type' => $type,
    'msg' => $msg,
    'ua' => mb_substr((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 300),
];
@file_put_contents($leadDir . '/leads.jsonl', json_encode($record, JSON_UNESCAPED_UNICODE) . "\n", FILE_APPEND | LOCK_EX);

$subject = '=?UTF-8?B?' . base64_encode('ai-ulu lead: ' . $name) . '?=';
$body = implode("\n", [
    'New request from ai-ulu.com',
    '',
    'Name:    ' . $name,
    'Reach:   ' . $reach,
    'Wants:   ' . $labels[$type],
    'When:    ' . $stamp,
    '',
    'Message:',
    $msg !== '' ? $msg : '(none)',
]);

$headers = 'From: ai-ulu form <' . SENDER . '>' . "\r\n"
    . 'Content-Type: text/plain; charset=UTF-8' . "\r\n"
    . 'MIME-Version: 1.0' . "\r\n"
    . 'X-Mailer: ai-ulu-form';

if (filter_var($reach, FILTER_VALIDATE_EMAIL)) {
    $headers .= "\r\n" . 'Reply-To: ' . $reach;
}

@mail(INBOX, $subject, $body, $headers, '-f' . SENDER);

echo json_encode(['ok' => true]);
