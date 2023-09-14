export default function ProfileIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 25 25"
      preserveAspectRatio="xMinYMin"
      role="img"
    >
      <title>profile icon</title>
      <g stroke="black" stroke-width="2.5" fill="transparent">
        <circle cx="50%" cy="50%" r="11.25" />
        <circle cx="50%" cy="9.5" r="3.5" />
        <circle
          cx="50%"
          cy="25.5"
          r="9"
          clip-path="circle(11.25 at 50% 50%) view-box"
        />
      </g>
    </svg>
  );
}
