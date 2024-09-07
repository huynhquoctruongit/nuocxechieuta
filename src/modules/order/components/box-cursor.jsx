import { useMyPresence, useOthers } from "@liveblocks/react/suspense";
import { useEffect, useRef, useState } from "react";
import Cursor from "./cursor";
import { MousePointer2 } from "lucide-react";

const CursorMode = {
  Hidden: "Hidden",
  Chat: "Chat",
  ReactionSelector: "ReactionSelector",
  Reaction: "Reaction",
};

const COLORS = ["#DC2626", "#D97706", "#059669", "#7C3AED", "#DB2777"];

const BoxCursor = ({ children }) => {
  const others = useOthers();
  const [{ cursor }, setMyPresence] = useMyPresence();
  const [state, setState] = useState({
    mode: CursorMode.Hidden,
  });
  const [_, updateMyPresence] = useMyPresence();
  const onPointerMove = (event) => {
    if (cursor == null || state.mode !== CursorMode.ReactionSelector) {
      updateMyPresence({
        cursor: {
          x: Math.round(event.clientX),
          y: Math.round(event.clientY),
        },
      });
    }
  };
  const onPointerLeave = () => {
    setState({
      mode: CursorMode.Hidden,
    });
    updateMyPresence({
      cursor: null,
      message: "",
      previousMessage: "",
    });
  };

  const refInput = useRef(null);
  const refState = useRef(state);
  refState.current = state;

  const onPointerDown = (event) => {
    updateMyPresence({
      cursor: {
        x: Math.round(event.clientX),
        y: Math.round(event.clientY),
      },
    });
    setState((state) => (state.mode === CursorMode.Reaction ? { ...state, isPressed: true } : state));
  };

  const onPointerUp = () => {
    setState((state) => (state.mode === CursorMode.Reaction ? { ...state, isPressed: false } : state));
  };

  useEffect(() => {
    function onKeyUp(e) {
      if (e.key === "/") {
        setState((state) => {
          if (state.mode === CursorMode.Chat) {
            refInput.current.focus();
            return state;
          }
          return { mode: CursorMode.Chat, previousMessage: null, message: "" };
        });
      } else if (e.key === "Escape") {
        updateMyPresence({ message: "" });
        setState({ mode: CursorMode.Hidden });
      } else if (e.key === "e") {
        setState({ mode: CursorMode.ReactionSelector });
      }
    }

    window.addEventListener("keyup", onKeyUp);
    function onKeyDown(e) {
      if (e.key === "/") {
        // e.preventDefault();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [updateMyPresence]);

  return (
    <div
      onPointerLeave={onPointerLeave}
      onPointerUp={onPointerUp}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      className="cusor-hidden"
    >
      {children}
      {cursor && <MyCursor refInput={refInput} state={state} setState={setState} />}
      {others
        .filter(({ presence }) => presence.profile)
        .map(({ connectionId, presence }) => {
          if (presence == null || !presence.cursor) {
            return null;
          }

          return (
            <Cursor
              key={connectionId}
              color={COLORS[connectionId % COLORS.length]}
              x={presence.cursor.x}
              y={presence.cursor.y}
              profile={presence.profile}
              message={presence.message}
            />
          );
        })}
      <div className="fixed bottom-1 left-1 w-fit px-2 py-2 z-50">
        <ul className="mt-4 flex lg:items-center flex-col lg:flex-row text-xs lg:justify-center gap-2">
          {/* <li className="flex items-center space-x-2 rounded-md bg-gray-100 py-2 px-3 text-sm">
            <span>Reactions</span>
            <span className="block rounded border border-gray-300 px-1 text-xs font-medium uppercase text-gray-500">E</span>
          </li> */}
          <li className="flex items-center space-x-2 rounded-md border border-gray-200 bg-white text-xs w-fit py-1 px-1.5 md:py-2 md:px-3  md:text-sm">
            <span className="text-gray-400">Chat</span>
            <span className="block rounded border border-white px-1 text-xs font-medium uppercase text-gray-400">/</span>
          </li>

          <li className="flex items-center space-x-2 rounded-md border border-gray-200 bg-white text-xs w-fit py-1 px-1.5 md:py-2 md:px-3  md:text-sm">
            <span className="text-gray-400">Escape</span>
            <span className="block rounded border border-white px-1 text-xs font-medium uppercase text-gray-400">esc</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BoxCursor;

const MyCursor = ({ refInput, state, setState }) => {
  const timer = useRef(null);
  const [{ cursor }, updateMyPresence] = useMyPresence();
  useEffect(() => {
    if (state.mode === CursorMode.Chat && state.message === "") {
      timer.current = setTimeout(() => {
        setState((oldState) => {
          if (oldState.message === "") return { mode: CursorMode.Hidden };
          return oldState;
        });
      }, 3000);
    }
    return () => clearTimeout(timer.current);
  }, [state]);
  return (
    <div
      className="fixed top-0 left-0"
      style={{
        transform: `translateX(${cursor.x}px) translateY(${cursor.y}px)`,
      }}
    >
      {state.mode === CursorMode.Chat && (
        <>
          <MousePointer2 className={"stroke-none fill-primary-01 relative cursor-none pointer-events-none"} />
          <div
            className="absolute top-full left-2 bg-primary-01 px-4 py-2 text-sm leading-relaxed text-white"
            onKeyUp={(e) => e.stopPropagation()}
            style={{
              borderRadius: 20,
            }}
          >
            {state.previousMessage && <div>{state.previousMessage}</div>}
            <input
              ref={refInput}
              className="w-60 border-none	bg-transparent text-white placeholder-white outline-none"
              autoFocus={true}
              onChange={(e) => {
                updateMyPresence({ message: e.target.value });
                setState({
                  mode: CursorMode.Chat,
                  previousMessage: null,
                  message: e.target.value,
                });
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setState({
                    mode: CursorMode.Chat,
                    previousMessage: state.message,
                    message: "",
                  });
                } else if (e.key === "Escape") {
                  setState({
                    mode: CursorMode.Hidden,
                  });
                }
              }}
              placeholder={state.previousMessage ? "" : "Say something…"}
              value={state.message}
              maxLength={50}
            />
          </div>
        </>
      )}
      {/* {state.mode === CursorMode.ReactionSelector && (
        <ReactionSelector
          setReaction={(reaction) => {
            setReaction(reaction);
          }}
        />
      )} */}
      {state.mode === CursorMode.Reaction && (
        <div className="pointer-events-none absolute top-3.5 left-1 select-none">{state.reaction}</div>
      )}
    </div>
  );
};
