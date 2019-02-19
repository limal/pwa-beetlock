import { Overmind } from "overmind";
import { createHook } from "overmind-react";

export const overmind = new Overmind({
  state: {
    authenticated: false
  }
});

export const useOvermind = createHook(overmind);
