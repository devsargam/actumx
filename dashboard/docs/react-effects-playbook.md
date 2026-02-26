# React Effects Playbook (Actumx Dashboard)

Use `useEffect` only for synchronization with external systems.

## Use Effect when

- Talking to external systems: network requests, browser APIs, subscriptions, timers.
- Running logic because a component is visible on screen.

## Do not use Effect when

- Deriving data from props/state.
- Handling user actions that happen at a specific event (click, submit, drag end).
- Resetting whole subtree state on prop change (use `key`).

## Preferred patterns

1. Derive during render

```tsx
const fullName = `${firstName} ${lastName}`;
```

2. Memoize only expensive calculations

```tsx
const visibleTodos = useMemo(() => getFilteredTodos(todos, filter), [todos, filter]);
```

3. Put interaction logic in handlers

```tsx
function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  post('/api/register', form);
}
```

4. Fetch with cleanup when using effects

```tsx
useEffect(() => {
  let ignore = false;

  fetch(url)
    .then((r) => r.json())
    .then((json) => {
      if (!ignore) setData(json);
    });

  return () => {
    ignore = true;
  };
}, [url]);
```

## Project notes

- Keep API fetch effects, but guard against stale responses when requests can overlap.
- Keep local storage, clipboard, and DOM sync logic in effects/handlers (external systems).
- Avoid derived-state effects like `setX(a + b)` in effects.

## PR checklist

- Can this value be computed in render instead of state?
- Is this logic event-specific? If yes, move to event handler.
- If using effect for fetch, is stale response cleanup handled?
- Are we avoiding effect chains that only trigger other state updates?
