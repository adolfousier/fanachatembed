import { For } from 'solid-js';

const boxPropsData = [
  {
    label: 'What can this bot do?',
    icon: '/question-mark.svg',
  },
  {
    label: 'Generate a photograph of a woman wearing a futuristic helmet, in the style of 8k 3d, meticulously detailed',
    icon: '/question-mark.svg',
  },
  {
    label: 'Make an image of an intricate mechanical heart, maximum detail, cinematic',
    icon: '/generate-image.svg',
  },
  {
    label: 'Create an image of a Shiba Inu wearing an astronaut suit and helmet, standing on the moon',
    icon: '/question-mark.svg',
  },
];

interface IPredefinedPromptsProps {
  onPredefinedPromptClick: any;
}

export const InitialScreen = (props: IPredefinedPromptsProps) => {
  return (
    <div class="mt-8 md:pr-4 flex w-full lg:h-screen md:h-screen lg:overflow-y-visible overflow-y-scroll flex-col items-center gap-4 lg:w-12/12">
      <img src="/bot-avatar.png" width={70} height={70} alt="starts" />
      <p class="bg-gradient-to-r from-[#007A5A] via-[#007A5A] to-[#00B786] bg-clip-text text-center text-[28px] font-bold text-transparent lg:text-[32px]">
        Hello! I&apos;m FANA, your AI companion.
      </p>
      <p class="max-w-[600px] text-center text-sm text-white">
        I&apos;m here to revolutionize interactions with intelligent, user-friendly, and efficient AI solutions. 🤓 How may I assist you today?"
      </p>
      <p class="text-sm font-extrabold">Ready to get started?</p>
      <div class="mt-6 grid lg:grid-cols-4 gap-2 lg:flex lg:justify-center grid-cols-2">
        <For each={boxPropsData}>
          {({ label, icon }) => {
            return <PredefinedPrompts onPredefinedPromptClick={props.onPredefinedPromptClick} label={label} icon={icon} />;
          }}
        </For>
      </div>
    </div>
  );
};

interface PredefinedPromptsProps {
  label: string;
  icon: string;
  onPredefinedPromptClick: any;
}

function PredefinedPrompts(props: PredefinedPromptsProps) {
  return (
    <div
      onClick={() => props.onPredefinedPromptClick(props.label)}
      class="relative flex lg:h-[209px] md:h-[185px] w-[170px] md:w-full lg:w-[220px] cursor-pointer rounded-2xl bg-[#272727] p-4 hover:border hover:border-red-500"
    >
      <p>{props.label}</p>
      <img class="absolute bottom-3 right-3" src={props.icon} width={30} height={30} alt="Prompt Image" />
    </div>
  );
}
