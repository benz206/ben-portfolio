"use client";

import { ReactNode, Children, isValidElement } from "react";
import Card from "@/components/Card";

interface ResponsiveTableProps {
    children: ReactNode;
}

function extractText(node: ReactNode): string {
    if (typeof node === "string" || typeof node === "number") {
        return String(node);
    }
    if (Array.isArray(node)) {
        return node.map(extractText).join(" ");
    }
    if (isValidElement(node)) {
        const props = node.props as { children?: ReactNode };
        if (props.children) {
            return extractText(props.children);
        }
    }
    return "";
}

function extractTableData(children: ReactNode) {
    let headers: string[] = [];
    const rows: ReactNode[][] = [];
    let processedThead = false;

    Children.forEach(children, (child) => {
        if (!isValidElement(child)) return;

        const childProps = child.props as {
            children?: ReactNode;
            className?: string;
        };

        const isThead =
            (typeof child.type === "string" && child.type === "thead") ||
            childProps.className?.includes("bg-gray-800");

        const isTbody =
            (typeof child.type === "string" && child.type === "tbody") ||
            (!childProps.className && !isThead);

        if (isThead && !processedThead) {
            Children.forEach(childProps.children, (theadChild) => {
                if (isValidElement(theadChild)) {
                    const trProps = theadChild.props as {
                        children?: ReactNode;
                    };
                    Children.forEach(trProps.children, (th) => {
                        if (isValidElement(th)) {
                            const thProps = th.props as {
                                children?: ReactNode;
                            };
                            headers.push(extractText(thProps.children));
                        }
                    });
                }
            });
            processedThead = true;
        }

        if (isTbody) {
            Children.forEach(childProps.children, (tbodyChild) => {
                if (isValidElement(tbodyChild)) {
                    const trProps = tbodyChild.props as {
                        children?: ReactNode;
                    };
                    const row: ReactNode[] = [];
                    Children.forEach(trProps.children, (cell) => {
                        if (isValidElement(cell)) {
                            const cellProps = cell.props as {
                                children?: ReactNode;
                            };
                            row.push(cellProps.children);
                        }
                    });
                    if (row.length > 0) {
                        if (headers.length === 0 && rows.length === 0) {
                            headers = row.map(extractText);
                        } else {
                            rows.push(row);
                        }
                    }
                }
            });
        }
    });

    return { headers, rows };
}

export default function ResponsiveTable({ children }: ResponsiveTableProps) {
    const { headers, rows } = extractTableData(children);
    const hasData = headers.length > 0 && rows.length > 0;

    return (
        <>
            {hasData && (
                <div className="block my-6 lg:hidden">
                    <div className="space-y-4">
                        {rows.map((row, rowIndex) => (
                            <Card
                                key={rowIndex}
                                variant="minimal"
                                size="md"
                                radius="lg"
                            >
                                <div className="space-y-2">
                                    {row.map((cell, cellIndex) => (
                                        <div
                                            key={cellIndex}
                                            className="flex flex-col pb-2 border-b border-gray-700 last:border-b-0 last:pb-0"
                                        >
                                            {headers[cellIndex] && (
                                                <div className="mb-1 text-xs font-bold text-gray-400 uppercase">
                                                    {headers[cellIndex]}
                                                </div>
                                            )}
                                            <div className="text-sm font-light text-gray-200">
                                                {cell}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
            <div
                className={`my-6 overflow-x-auto ${
                    hasData ? "hidden lg:block" : ""}`}
            >
                <table className="min-w-full border border-gray-600 border-collapse">
                    {children}
                </table>
            </div>
        </>
    );
}
