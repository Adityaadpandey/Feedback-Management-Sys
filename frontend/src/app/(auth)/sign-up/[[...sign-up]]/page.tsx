import { SignUp } from "@clerk/nextjs";
import React from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <div>
      <SignUp />
    </div>
  );
};

export default page;
