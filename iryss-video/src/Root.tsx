import { Composition } from "remotion";
import { IryssPitch } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="IryssPitch"
        component={IryssPitch}
        durationInFrames={3240} // 108s @ 30fps
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
