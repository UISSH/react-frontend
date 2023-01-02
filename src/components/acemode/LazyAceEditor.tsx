import { ReactNode, Suspense } from "react";
import ModeAce from "./ModeAce";

export type ModeAceType = keyof typeof ModeAce;

export default function LazyMode({
  children,
  mode,
}: {
  children: ReactNode;
  mode: ModeAceType;
}) {
  let ParentReactNode = ModeAce[mode];
  return (
    <>
      <Suspense>
        <ParentReactNode>{children}</ParentReactNode>
      </Suspense>
    </>
  );
}
