"use client";

import Header from "@/app/ui/Header";
import Image from "next/image";
import editSvg from "@/public/edit-pencil.svg";
import { useEffect, useRef, useState } from "react";
export default function CreatePage() {
  const [title, setTitle] = useState("New Prompt");
  // const titleRef = useRef<HTMLInputElement | null>(null);
  const measureTitleRef = useRef<HTMLSpanElement | null>(null);
  const [titleWidth, setTitleWidth] = useState<string>("2ch");
  useEffect(() => {
    if (measureTitleRef.current) {
      setTitleWidth(`${measureTitleRef.current.offsetWidth + 2}px`); // small padding for caret
    }
  }, [title]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault(); // prevent form submission
      const form = e.currentTarget.form; // the enclosing form element
      if (!form) return;

      const index = Array.prototype.indexOf.call(
        form.elements,
        e.currentTarget,
      );
      const next = form.elements[index + 1] as HTMLElement | undefined;
      if (next) {
        next.focus(); // move focus to next input/button/etc
      }
    }
  }

  return (
    <main className={"h-full w-full flex flex-col gap-4"}>
      <div className={"flex justify-center items-center h-16"}>
        <Header />
      </div>
      <div className={"flex justify-center items-center"}>
        <form
          // onSubmit={(e) => e.preventDefault()}
          className={"flex flex-col gap-4 items-center"}
        >
          <label
            htmlFor="title"
            className={"flex items-center gap-2 w-fit h-fit"}
          >
            <div style={{ width: "20px", height: "20px" }} />
            <div className={"relative inline-block"}>
              <span
                ref={measureTitleRef}
                className="absolute invisible whitespace-pre text-xl font-semibold"
              >
                {title || " "}
              </span>
              <input
                id="title"
                value={title}
                // ref={titleRef}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: titleWidth }}
                className="text-xl font-semibold bg-transparent border-none focus:border-b"
                onKeyDown={handleKeyDown}
                // onKeyPress={(e) =>
                //   e.key === "Enter" && titleRef.current?.blur()
                // }
              />
            </div>
            <Image
              src={editSvg}
              alt="Edit icon."
              height={20}
              width={20}
              // onClick={() => titleRef.current?.focus()}
              className="cursor-pointer"
            />
          </label>
          <label className={"bg-gray-800 rounded-xl h-124 w-116 p-4"}>
            <textarea
              className={
                "h-full w-full border-none outline-none resize-none bg-transparent"
              }
              defaultValue={
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam a neque id dolor ullamcorper hendrerit. Ut maximus ornare metus, vitae dignissim est. Nam in risus eros. Sed sodales, purus at egestas volutpat, tortor metus maximus velit, ac lobortis odio dui vel orci. Aenean erat arcu, fermentum ac sem at, molestie pharetra dolor. Maecenas fringilla augue in tortor euismod rutrum vitae vitae enim. Sed sed gravida sapien, nec viverra justo. Maecenas nec scelerisque nisl. Ut dui tortor, tincidunt ut accumsan vitae, imperdiet vitae ipsum. Pellentesque dictum lectus metus, ut aliquet ipsum rhoncus malesuada. Pellentesque pretium lectus nec lacus semper ullamcorper.\n" +
                "\n" +
                "Duis vel ipsum eget velit pharetra elementum. Cras ornare ac tellus at sollicitudin. Sed rhoncus nec nisl quis condimentum. Donec consectetur ante ex, eget cursus quam gravida eget. Mauris volutpat nisl purus, et scelerisque nunc consectetur vel. Cras quis felis in nisi maximus eleifend sed ac urna. Duis in ligula nibh. Nullam non ligula nisi. Vestibulum porttitor ac turpis non tincidunt. Pellentesque nibh enim, pharetra in ultrices eu, hendrerit et nulla. Integer molestie quam et accumsan sollicitudin. Nullam in cursus metus, a porta ex. Vestibulum semper, velit id interdum dapibus, sapien lacus auctor turpis, eget porta lorem eros ac leo. Fusce sagittis posuere auctor. Nunc facilisis est dui.\n" +
                "\n" +
                "Proin posuere enim sapien, ac gravida nulla porta nec. Nam efficitur lacus ut justo imperdiet, ut porttitor erat tempor. Curabitur sed porta nulla, malesuada vulputate eros. Aliquam erat volutpat. Duis id sodales ipsum. Cras facilisis cursus sem, a sodales purus venenatis ac. Vivamus eleifend ligula tincidunt ipsum porta fringilla. Nulla ac dapibus justo, ut ultricies urna. Maecenas metus neque, consectetur ut pulvinar ut, vestibulum non lectus.\n" +
                "\n" +
                "Etiam vel urna at ex condimentum mattis ac non tortor. Proin a lacus est. Maecenas sit amet lectus risus. Ut at dignissim odio. Duis sed egestas justo. Fusce mattis sollicitudin pellentesque. Vestibulum vel nisl in erat faucibus pulvinar eget eu erat.\n" +
                "\n" +
                "Phasellus et est turpis. Quisque rhoncus tortor ac dui mollis facilisis. Nullam pretium, quam vel rutrum imperdiet, tortor ligula dictum diam, tempus vehicula eros magna vel felis. Ut eget dictum purus. Maecenas ullamcorper sit amet ipsum a mollis. Vivamus ut euismod sem. Nulla eget consectetur dui."
              }
            />
          </label>
        </form>
      </div>
    </main>
  );
}
