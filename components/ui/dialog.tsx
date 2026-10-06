"use client";
import type{ComponentPropsWithoutRef,ElementRef,ReactNode}from"react";
import{forwardRef}from"react";
import*as DialogPrimitive from"@radix-ui/react-dialog";
import{X}from"lucide-react";
export const Dialog=DialogPrimitive.Root;
export const DialogTrigger=DialogPrimitive.Trigger;
export const DialogClose=DialogPrimitive.Close;
export const DialogTitle=DialogPrimitive.Title;
export const DialogDescription=DialogPrimitive.Description;
export const DialogContent=forwardRef<ElementRef<typeof DialogPrimitive.Content>,ComponentPropsWithoutRef<typeof DialogPrimitive.Content>&{children:ReactNode}>(({className="",children,...props},ref)=><DialogPrimitive.Portal><DialogPrimitive.Overlay className="uiDialogOverlay"/><DialogPrimitive.Content ref={ref} className={"uiDialogContent "+className} {...props}>{children}<DialogPrimitive.Close className="uiDialogClose" aria-label="Close dialog"><X size={18}/></DialogPrimitive.Close></DialogPrimitive.Content></DialogPrimitive.Portal>);
DialogContent.displayName="DialogContent";
export function DialogHeader({children}:{children:ReactNode}){return <div className="uiDialogHeader">{children}</div>}
export function DialogFooter({children}:{children:ReactNode}){return <div className="uiDialogFooter">{children}</div>}