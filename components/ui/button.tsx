import type{ButtonHTMLAttributes}from"react";
type Variant="primary"|"secondary"|"ghost"|"danger";type Size="sm"|"md"|"icon";
export function Button({variant="primary",size="md",className="",...props}:ButtonHTMLAttributes<HTMLButtonElement>&{variant?:Variant;size?:Size}){return <button className={"uiButton uiButton-"+variant+" uiButton-"+size+" "+className} {...props}/>} 