import { Composition } from "remotion";
import { IryssPitch } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="IryssPitch"
        component={IryssPitch}
        durationInFrames={3330} // 111s @ 30fps (extended from 90s for breathing room)
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
