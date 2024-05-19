"use client";

import { XIcon } from "lucide-react";
import React from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className="fixed left-0 top-0 grid h-[100vh] w-[100vw] place-content-center overflow-scroll">
      <div className="absolute left-0 top-0 grid min-h-full w-full place-items-center py-6">
        <div className="z-50 w-fit rounded-md bg-primary-foreground">
          <div className=" flex items-center justify-between border-b border-primary px-6 pb-6 pt-5">
            <span>{title}</span>
            <XIcon onClick={onClose} className="cursor-pointer" />
          </div>
          <div className="p-6 pt-4">{children}</div>
        </div>
        <div
          className="absolute left-0 top-0 z-40 min-h-full w-full bg-secondary-foreground opacity-60"
          onClick={onClose}
        ></div>
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
