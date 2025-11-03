import primary from "../assets/images/logo/primary.svg";
import primaryCompact from "../assets/images/logo/primary-compact.svg";
import secondary from "../assets/images/logo/secondary.svg";

interface UIConfigType {
  logo: {
    primary: string;
    primaryCompact: string;
    secondary: string;
  };
}

const UIConfig: UIConfigType = {
  logo: {
    primary,
    primaryCompact,
    secondary,
  },
};

export default UIConfig;