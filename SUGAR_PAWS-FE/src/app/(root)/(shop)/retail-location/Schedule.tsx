"use client";

import CtaButton from "@/components/ui/CtaButton";
import React from "react";

const Schedule = () => {
  return (
    <div className="w-full h-[232px] bg-custom-pink flex flex-col items-center justify-center gap-2">
      <h1 className="font-bold text-[32px] text-custom-purple">
        Make a Wednesday Appointment
      </h1>
      <p className="text-16px mb-1">
        On Wednesdays, we&apos;re open by appointment only.
      </p>
      <CtaButton text="SCHEDULE" onClick={() => console.log("hehe")} />
    </div>
  );
};

export default Schedule;
