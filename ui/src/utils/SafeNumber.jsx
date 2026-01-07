const SafeNumber = (v) => (Number.isFinite(v) ? v : null);
export default SafeNumber;
