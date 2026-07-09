export function isSponsorshipCurrent(
  isSponsored: boolean,
  sponsoredUntil: string | null | undefined,
  nowMs = Date.now(),
) {
  return (
    isSponsored &&
    !!sponsoredUntil &&
    new Date(sponsoredUntil).getTime() > nowMs
  );
}

export function isSponsorshipExpired(
  isSponsored: boolean,
  sponsoredUntil: string | null | undefined,
  nowMs = Date.now(),
) {
  return (
    isSponsored &&
    !!sponsoredUntil &&
    new Date(sponsoredUntil).getTime() <= nowMs
  );
}
