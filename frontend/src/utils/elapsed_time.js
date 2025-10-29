
export function elapsed_time(createdAt) {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now - created;

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 30) {
    return 'Just Now';
  } else if (seconds < 60) {
    return `${seconds}s ago`;
  } else if (minutes < 60) {
    return `${minutes}m ago`;
  } else if (hours < 24) {
    return `${hours}h ago`;
  } else if (days === 1) {
    return 'Yesterday';
  } else if (days < 7) {
    return `${days}d ago`;
  } else {
    // Format: '27 Oct' or '2 Jan 2020' if year differs
    const options = { day: 'numeric', month: 'short' };
    if (created.getFullYear() !== now.getFullYear()) {
      options.year = 'numeric';
    }
    return created.toLocaleDateString('en-GB', options);
  }
}
