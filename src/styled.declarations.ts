// import original module declarations
import "styled-components";

// and extend them!
declare module "styled-components" {
  export interface DefaultTheme {
    name: string;
    colors: {
      primary: string;
      primary2: string;
      primary3: string;
      primaryHover: string;
      secondary: string;
      secondary2: string;
      secondaryHover: string;
      tertiary: string;
      tertiary2: string;
      tertiary3: string;
    };
  }
}
