import { Button } from "@mui/material";
import { useRef, useState } from "react";

export default function Index() {
  const [count, setCount] = useState(0);
  const conut2 = useRef(0);

  useState(() => {
    console.log(conut2.current);
    console.log("useEffect");
  });
  return (
    <Button
      onClick={() => {
        conut2.current = conut2.current + 1;
      }}>
      {conut2.current}
    </Button>
  );
}
