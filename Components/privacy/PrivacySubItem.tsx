"use client";

import React from "react";

export type PrivacyItem =
  | {
    variant: "table";
    title: string;
    subtitle?: string;
    rows: Array<{ left: string; right: string }>;
  }
  | {
    variant: "highlight";
    title: string;
    subtitle?: string;
    content: string;
  }
  | {
    variant: "list";
    title: string;
    subtitle?: string;
    bullets: string[];
  }
  | {
    variant: "paragraph";
    title: string;
    subtitle?: string;
    content: string;
  };

interface PrivacySubItemProps {
  data: PrivacyItem;
}

const PrivacySubItem: React.FC<PrivacySubItemProps> = ({ data }) => {
  return (
    <article className="bg-white border border-[#eaeaea] rounded-lg shadow-sm p-6 text-[#454648]">
      {/* Header */}
      <header className="mb-4">
        <h3 className="text-xl font-semibold text-[#225e4d] mb-1">
          {data.title}
        </h3>
        {data.subtitle && (
          <p className="text-sm text-[#454648]/80">{data.subtitle}</p>
        )}
      </header>

      {/* Body */}
      <div className="space-y-4">

        {/* TABLE */}
        {data.variant === "table" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-[#454648]">
                  <th className="text-left py-3 pr-4 border-b border-[#eaeaea] font-medium">
                    What we use your personal data for
                  </th>
                  <th className="text-left py-3 pl-4 border-b border-[#eaeaea] font-medium">
                    Our reasons
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((row, idx) => (
                  <tr key={idx} className={idx % 2 !== 0 ? "bg-white" : "bg-white"}>
                    <td className="py-4 pr-4 border-b border-[#eaeaea] align-top text-[#454648]">
                      {row.left}
                    </td>
                    <td className="py-4 pl-4 border-b border-[#eaeaea] align-top text-[#454648]">
                      {row.right}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* HIGHLIGHT BOX */}
        {data.variant === "highlight" && (
          <div className="border border-[#ffd5d8] bg-[#fff1f2] rounded-md p-4 text-sm text-[#454648]">
            <p dangerouslySetInnerHTML={{ __html: data.content }} />
          </div>
        )}

        {/* LIST */}
        {data.variant === "list" && (
          <ul className="list-disc list-inside text-sm text-[#454648] space-y-2">
            {data.bullets.map((bullet, i) => (
              <li key={i}>{bullet}</li>
            ))}
          </ul>
        )}

        {/* PARAGRAPH */}
        {data.variant === "paragraph" && (
          <p className="text-sm text-[#454648]">{data.content}</p>
        )}
      </div>
    </article>
  );
};

export default PrivacySubItem;
