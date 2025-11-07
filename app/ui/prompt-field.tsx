import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/store";
import { updatePromptString } from "@/app/lib/slices/PromptSlice";

export default function PromptField({
  initialPrompt,
}: {
  initialPrompt: string;
}) {
  const promptState = useAppSelector(
    (state) => state.activePrompt.entity?.prompt,
  );
  const dispatch = useAppDispatch();
  const prompt = promptState ?? initialPrompt;
  const onUpdatePrompt = useCallback(
    (promptString: string) => {
      dispatch(updatePromptString(promptString));
    },
    [dispatch],
  );
  return (
    <div className={"bg-gray-900 rounded-xl p-4 w-full h-full"}>
      <textarea
        data-testid="prompt-textarea"
        className={
          "h-full w-full border-none outline-none resize-none bg-transparent"
        }
        onChange={(e) => onUpdatePrompt?.(e.target.value)}
        // defaultValue={
        //   "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam a neque id dolor ullamcorper hendrerit. Ut maximus ornare metus, vitae dignissim est. Nam in risus eros. Sed sodales, purus at egestas volutpat, tortor metus maximus velit, ac lobortis odio dui vel orci. Aenean erat arcu, fermentum ac sem at, molestie pharetra dolor. Maecenas fringilla augue in tortor euismod rutrum vitae vitae enim. Sed sed gravida sapien, nec viverra justo. Maecenas nec scelerisque nisl. Ut dui tortor, tincidunt ut accumsan vitae, imperdiet vitae ipsum. Pellentesque dictum lectus metus, ut aliquet ipsum rhoncus malesuada. Pellentesque pretium lectus nec lacus semper ullamcorper.\n" +
        //   "\n" +
        //   "Duis vel ipsum eget velit pharetra elementum. Cras ornare ac tellus at sollicitudin. Sed rhoncus nec nisl quis condimentum. Donec consectetur ante ex, eget cursus quam gravida eget. Mauris volutpat nisl purus, et scelerisque nunc consectetur vel. Cras quis felis in nisi maximus eleifend sed ac urna. Duis in ligula nibh. Nullam non ligula nisi. Vestibulum porttitor ac turpis non tincidunt. Pellentesque nibh enim, pharetra in ultrices eu, hendrerit et nulla. Integer molestie quam et accumsan sollicitudin. Nullam in cursus metus, a porta ex. Vestibulum semper, velit id interdum dapibus, sapien lacus auctor turpis, eget porta lorem eros ac leo. Fusce sagittis posuere auctor. Nunc facilisis est dui.\n" +
        //   "\n" +
        //   "Proin posuere enim sapien, ac gravida nulla porta nec. Nam efficitur lacus ut justo imperdiet, ut porttitor erat tempor. Curabitur sed porta nulla, malesuada vulputate eros. Aliquam erat volutpat. Duis id sodales ipsum. Cras facilisis cursus sem, a sodales purus venenatis ac. Vivamus eleifend ligula tincidunt ipsum porta fringilla. Nulla ac dapibus justo, ut ultricies urna. Maecenas metus neque, consectetur ut pulvinar ut, vestibulum non lectus.\n" +
        //   "\n" +
        //   "Etiam vel urna at ex condimentum mattis ac non tortor. Proin a lacus est. Maecenas sit amet lectus risus. Ut at dignissim odio. Duis sed egestas justo. Fusce mattis sollicitudin pellentesque. Vestibulum vel nisl in erat faucibus pulvinar eget eu erat.\n" +
        //   "\n" +
        //   "Phasellus et est turpis. Quisque rhoncus tortor ac dui mollis facilisis. Nullam pretium, quam vel rutrum imperdiet, tortor ligula dictum diam, tempus vehicula eros magna vel felis. Ut eget dictum purus. Maecenas ullamcorper sit amet ipsum a mollis. Vivamus ut euismod sem. Nulla eget consectetur dui."
        // }
        value={prompt}
        placeholder={"Write me a cover letter..."}
      />
    </div>
  );
}
