"use client";

import Image from "next/image";
import { Input, InputProps } from "./input";
import { useState } from "react";
import { CircleCheck, CircleX } from "lucide-react";

export const PasswordInput = (props: InputProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");

  // password condition checks
  const isLongEnough = password.length >= 10;
  const hasSpecialCharacter = /[^A-Za-z0-9]/.test(password);
  const hasLetter = /[A-Za-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        name={props.name}
        placeholder={props.placeholder}
        className={props.className}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => {
          setPassword(e.target.value);
          props.onChange && props.onChange(e);
        }}
      >
        <button
          type="button"
          className="absolute w-5 h-4 p-1 top-1/2 -translate-y-1/2 right-4 text-font"
          onClick={() => setShowPassword((v) => !v)}
          onMouseDown={(e) => e.preventDefault()} 
          tabIndex={-1}
        >
          <Image
            src={`/icons/${showPassword ? "hide_pw" : "show_pw"}.svg`}
            alt={`${showPassword ? "hide_pw" : "show_pw"}`}
            fill
          />
        </button>
      </Input>
      <div className={`absolute top-full w-full z-50 rounded bg-popover border border-popover-foreground/90 shadow-lg px-4 py-3 flex flex-col gap-2 text-sm translate-y-3 ${!focused && "hidden"}`}>
        <div className="flex items-center gap-2">
          {isLongEnough ? (<CircleCheck className="text-green-500" />) : (<CircleX className="text-red-500" />)}
          <span>At least 10 characters</span>
        </div>
        <div className="flex items-center gap-2">
          {hasSpecialCharacter ? (<CircleCheck className="text-green-500" />) : (<CircleX className="text-red-500" />)}
          <span>At least one special character</span>
        </div>
        <div className="flex items-center gap-2">
          {hasLetter ? (<CircleCheck className="text-green-500" />) : (<CircleX className="text-red-500" />)}
          <span>At least one letter</span>
        </div>
        <div className="flex items-center gap-2">
          {hasDigit ? (<CircleCheck className="text-green-500" />) : (<CircleX className="text-red-500" />)}
          <span>At least one number</span>
        </div>
      </div>
    </div>
  );
};
