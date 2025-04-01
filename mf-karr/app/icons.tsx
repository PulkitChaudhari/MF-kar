// Consolidated file for all React icons used in the application
import { IconSvgProps } from "@/types";

// Import icons from react-icons packages
import { FaRegEdit, FaCheck } from "react-icons/fa";
import { MdModeEditOutline } from "react-icons/md";
import { TfiSave } from "react-icons/tfi";
import { CiExport } from "react-icons/ci";
import { GiInjustice } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";
import { IoLockClosed, IoReloadOutline } from "react-icons/io5";
import { VscGraphLine } from "react-icons/vsc";

// SVG Icons
export const DeleteIcon = (props: IconSvgProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 20 20"
      width="1em"
      {...props}
    >
      <path
        d="M17.5 4.98332C14.725 4.70832 11.9333 4.56665 9.15 4.56665C7.5 4.56665 5.85 4.64998 4.2 4.81665L2.5 4.98332"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M7.08331 4.14169L7.26665 3.05002C7.39998 2.25835 7.49998 1.66669 8.90831 1.66669H11.0916C12.5 1.66669 12.6083 2.29169 12.7333 3.05835L12.9166 4.14169"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M15.7084 7.61664L15.1667 16.0083C15.075 17.3166 15 18.3333 12.675 18.3333H7.32502C5.00002 18.3333 4.92502 17.3166 4.83335 16.0083L4.29169 7.61664"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M8.60834 13.75H11.3833"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M7.91669 10.4167H12.0834"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
};

export const EditIcon = (props: IconSvgProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 20 20"
      width="1em"
      {...props}
    >
      <path
        d="M11.05 3.00002L4.20835 10.2417C3.95002 10.5167 3.70002 11.0584 3.65002 11.4334L3.34169 14.1334C3.23335 15.1084 3.93335 15.775 4.90002 15.6084L7.58335 15.15C7.95835 15.0834 8.48335 14.8084 8.74168 14.525L15.5834 7.28335C16.7667 6.03335 17.3 4.60835 15.4583 2.86668C13.625 1.14168 12.2334 1.75002 11.05 3.00002Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
      <path
        d="M9.90833 4.20831C10.2667 6.50831 12.1333 8.26665 14.45 8.49998"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
      <path
        d="M2.5 18.3333H17.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
    </svg>
  );
};

// Calendar icon for date inputs
export const CalendarIcon = (props: any) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M7.75 2.5a.75.75 0 0 0-1.5 0v1.58c-1.44.115-2.384.397-3.078 1.092c-.695.694-.977 1.639-1.093 3.078h19.842c-.116-1.44-.398-2.384-1.093-3.078c-.694-.695-1.639-.977-3.078-1.093V2.5a.75.75 0 0 0-1.5 0v1.513C15.585 4 14.839 4 14 4h-4c-.839 0-1.585 0-2.25.013z"
        fill="currentColor"
      />
      <path
        clipRule="evenodd"
        d="M2 12c0-.839 0-1.585.013-2.25h19.974C22 10.415 22 11.161 22 12v2c0 3.771 0 5.657-1.172 6.828C19.657 22 17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.172C2 19.657 2 17.771 2 14zm15 2a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2m-4-5a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-6-3a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const SaveIcon = ({
  fill = "currentColor",
  filled = true,
  size = 24,
  height = 24,
  width = 24,
  ...props
}) => {
  return (
    <svg
      fill="none"
      height={size || height || 24}
      viewBox="0 0 24 24"
      width={size || width || 24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        clipRule="evenodd"
        d="M17.44 6.236c.04.07.11.12.2.12 2.4 0 4.36 1.958 4.36 4.355v5.934A4.368 4.368 0 0117.64 21H6.36A4.361 4.361 0 012 16.645V10.71a4.361 4.361 0 014.36-4.355c.08 0 .16-.04.19-.12l.06-.12.106-.222a97.79 97.79 0 01.714-1.486C7.89 3.51 8.67 3.01 9.64 3h4.71c.97.01 1.76.51 2.22 1.408.157.315.397.822.629 1.31l.141.299.1.22zm-.73 3.836c0 .5.4.9.9.9s.91-.4.91-.9-.41-.909-.91-.909-.9.41-.9.91zm-6.44 1.548c.47-.47 1.08-.719 1.73-.719.65 0 1.26.25 1.72.71.46.459.71 1.068.71 1.717A2.438 2.438 0 0112 15.756c-.65 0-1.26-.25-1.72-.71a2.408 2.408 0 01-.71-1.717v-.01c-.01-.63.24-1.24.7-1.699zm4.5 4.485a3.91 3.91 0 01-2.77 1.15 3.921 3.921 0 01-3.93-3.926 3.865 3.865 0 011.14-2.767A3.921 3.921 0 0112 9.402c1.05 0 2.04.41 2.78 1.15.74.749 1.15 1.738 1.15 2.777a3.958 3.958 0 01-1.16 2.776z"
        fill={fill}
        fillRule="evenodd"
      />
    </svg>
  );
};

export const JusticeScaleIcon = ({
  fill = "black",
  filled = true,
  size = 32,
  height = 32,
  width = 32,
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? fill : "none"}
      height={size || height || 32}
      width={size || width || 32}
      {...props}
    >
      <path
        d="M113.854 61.24h-1.98l-10.014-20.5a4.4 4.4 0 0 0-.746-8.74H70.875v-1.208a6.848 6.848 0 0 0-2.195-5.022 7.51 7.51 0 1 0-9.36 0 6.848 6.848 0 0 0-2.2 5.022V32H26.886a4.4 4.4 0 0 0-.746 8.745L16.126 61.24h-1.98a1.75 1.75 0 0 0-1.75 1.75 16.511 16.511 0 0 0 33.021 0 1.749 1.749 0 0 0-1.75-1.75h-1.981l-9.977-20.42h25.416v48.1h-5.458a9.76 9.76 0 0 0-9.584 8h-4.25a1.749 1.749 0 0 0-1.75 1.75v15.187a1.75 1.75 0 0 0 1.75 1.75h52.334a1.75 1.75 0 0 0 1.75-1.75v-15.19a1.749 1.749 0 0 0-1.75-1.75h-4.25a9.76 9.76 0 0 0-9.584-8h-5.458V40.82h25.416l-9.977 20.42h-1.981a1.749 1.749 0 0 0-1.75 1.75 16.511 16.511 0 0 0 33.021 0 1.75 1.75 0 0 0-1.75-1.75zM59.99 19.907a4.01 4.01 0 1 1 4.01 4.01 4.015 4.015 0 0 1-4.01-4.01zM28.906 76a13.029 13.029 0 0 1-12.892-11.26H41.8A13.031 13.031 0 0 1 28.906 76zm-8.885-14.76 8.885-18.183 8.885 18.183zm6.865-23.92a.91.91 0 0 1 0-1.82h30.239v1.82zm61.531 74.78H39.583v-11.683h48.834zm-6.088-15.183H45.671a6.257 6.257 0 0 1 6-4.5h24.662a6.257 6.257 0 0 1 5.996 4.5zm-21.7-8V30.792a3.375 3.375 0 0 1 6.75 0v58.125zM70.875 35.5h30.239a.91.91 0 0 1 0 1.82H70.875zm28.219 7.557 8.885 18.183h-17.77zm0 32.943A13.031 13.031 0 0 1 86.2 64.74h25.786A13.029 13.029 0 0 1 99.094 76z"
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
};
// Re-export all icons
export {
  FaRegEdit,
  FaCheck,
  MdModeEditOutline,
  TfiSave,
  CiExport,
  GiInjustice,
  RxCross2,
  IoLockClosed,
  IoReloadOutline,
  VscGraphLine,
};
