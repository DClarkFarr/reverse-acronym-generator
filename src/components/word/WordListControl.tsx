import { useRef, useState } from "react";
import { Transition, TransitionStatus } from "react-transition-group";
import { upperFirst } from "lodash";
import { ResponseWord } from "../../services/dataMuseApi";

const WordListControl = ({
  label,
  onRefresh,
  onReplace,
  words,
  wordLists,
}: {
  words: string[];
  label: string;
  wordLists: ResponseWord[][];
  onRefresh: () => void;
  onReplace: (listIndex: number, wordIndex: number) => void;
}) => {
  const nodeRef = useRef(null);
  const [inProp, setInProp] = useState(words.map(() => false));

  const defaultStyle = {
    transition: `opacity ${250}ms ease-in-out`,
    opacity: 0,
  };

  const transitionStyles: { [K in TransitionStatus]: object } = {
    entering: { opacity: 1 },
    entered: { opacity: 1 },
    exiting: { opacity: 0 },
    exited: { opacity: 0, visibility: "hidden" },
    unmounted: { opacity: 0, visibility: "hidden" },
  };

  const onMouseEnter = (index: number) => {
    const s = [...inProp].map(() => false);
    s.splice(index, 1, true);
    setInProp(s);
  };

  const onMouseLeave = (index: number) => {
    const s = [...inProp].map(() => false);
    s.splice(index, 1, false);
    setInProp(s);
  };

  const onClickItem = (i: number, ii: number) => {
    onReplace(i, ii);

    setInProp([...inProp].map(() => false));
  };

  return (
    <>
      <h3 className="text-lg font-medium mb-2">{label}</h3>
      <div className="flex gap-2">
        {words.map((word, i) => (
          <div
            className="word-dropdown relative"
            data-index={i}
            key={i}
            onMouseEnter={() => onMouseEnter(i)}
            onMouseLeave={() => onMouseLeave(i)}
          >
            <div className="word-dropdown__button text-gray-700 bg-slate-100 border border-slate-200 cursor-pointer p-2 rounded hover:bg-slate-200 hover:border-slate-400 transition-all">
              {upperFirst(word)}
            </div>
            <Transition nodeRef={nodeRef} in={inProp[i]} timeout={250}>
              {(state) => (
                <div
                  ref={nodeRef}
                  style={{
                    ...defaultStyle,
                    ...transitionStyles[state],
                  }}
                  data-in={inProp[i]}
                  data-state={state}
                  className="word-dropdown__list absolute border-slate-500 border p-2 rounded drop-shadow-lg bg-gray-100 grid gap-1"
                >
                  {wordLists[i].map((item, ii) => (
                    <div
                      className={`word-dropdown__list-item transition-all cursor-pointer hover:bg-slate-300 p-1 ${
                        word === item.word
                          ? "word-dropdown__list-item--selected bg-sky-300"
                          : ""
                      }`}
                      key={`${i}-${ii}`}
                      onClick={() => onClickItem(i, ii)}
                    >
                      {item.word}
                    </div>
                  ))}
                </div>
              )}
            </Transition>
          </div>
        ))}
        <div className="ml-auto">
          <button
            className="btn btn-sm bg-red-700 hover:bg-red-900"
            onClick={onRefresh}
          >
            Shuffle
          </button>
        </div>
      </div>
    </>
  );
};

export default WordListControl;
