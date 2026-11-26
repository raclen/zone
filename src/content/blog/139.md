---
title: "TypeScript 与 React 结合常见的用法"
description: "TypeScript 与 React 结合，可以为组件的 Props、State 和事件处理函数等添加强类型约束，这有助于提高代码的可读性和可靠性。以下是一些常见的 TypeScript 与 React 组件结合的示例。  1. **函数式组件（Function Component）**  ..."
pubDate: 2024-09-25T08:47:59Z
issueNumber: 139
issueUrl: https://github.com/raclen/zone/issues/139
tags: ["前端", "React", "idea", "TypeScript"]
author:
  name: "raclen"
  avatar: "https://avatars.githubusercontent.com/u/7697758?v=4"
draft: false
---


TypeScript 与 React 结合，可以为组件的 Props、State 和事件处理函数等添加强类型约束，这有助于提高代码的可读性和可靠性。以下是一些常见的 TypeScript 与 React 组件结合的示例。

### 1. **函数式组件（Function Component）**

函数式组件是 React 中最常用的组件形式。我们可以通过 TypeScript 为 Props 添加类型。

```tsx
import React from 'react';

// 定义 Props 类型
interface ButtonProps {
  label: string;
  onClick: () => void;
}

// 函数组件使用 Props 类型
const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  return <button onClick={onClick}>{label}</button>;
};

// 使用组件
const App = () => {
  return <Button label="Click me" onClick={() => alert('Clicked!')} />;
};

export default App;
```

- **说明**：我们使用 `React.FC<ButtonProps>` 来定义函数式组件的类型，并确保组件接收 `label` 和 `onClick` 作为 Props。

### 2. **类组件（Class Component）**

虽然函数式组件较为流行，但类组件仍然存在一些应用场景。我们可以通过 TypeScript 为类组件的 `Props` 和 `State` 添加类型。

```tsx
import React, { Component } from 'react';

// 定义 Props 和 State 类型
interface CounterProps {
  initialCount: number;
}

interface CounterState {
  count: number;
}

// 定义类组件并为 Props 和 State 添加类型
class Counter extends Component<CounterProps, CounterState> {
  constructor(props: CounterProps) {
    super(props);
    this.state = {
      count: props.initialCount,
    };
  }

  increment = () => {
    this.setState((prevState) => ({ count: prevState.count + 1 }));
  };

  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.increment}>Increment</button>
      </div>
    );
  }
}

// 使用组件
const App = () => {
  return <Counter initialCount={0} />;
};

export default App;
```

- **说明**：我们为 `Props` 和 `State` 明确指定了类型，这样在使用和更新 `state` 时 TypeScript 会提供类型检查。

### 3. **处理事件（Event Handling）**

处理事件时，可以为事件处理函数和事件对象指定类型。

```tsx
import React from 'react';

const InputField: React.FC = () => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  return <input type="text" onChange={handleChange} />;
};

export default InputField;
```

- **说明**：`React.ChangeEvent<HTMLInputElement>` 是 `onChange` 事件处理函数的事件类型。

### 4. **使用 `useState` 和 `useEffect`**

在使用 React Hooks 时，TypeScript 也能为 `useState` 和 `useEffect` 添加类型。

```tsx
import React, { useState, useEffect } from 'react';

const Counter: React.FC = () => {
  // useState 的类型推断
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

export default Counter;
```

- **说明**：`useState<number>(0)` 明确了 `count` 的类型是 `number`，这样在 `setCount` 时就能确保赋值为数字。

### 5. **默认 Props 和可选 Props**

使用 TypeScript 可以为 Props 提供默认值和可选值。

```tsx
import React from 'react';

// 定义 Props 类型，`subtitle` 为可选
interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle = 'Default Subtitle' }) => {
  return (
    <div>
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
    </div>
  );
};

// 使用组件
const App = () => {
  return <Header title="Hello, World!" />;
};

export default App;
```

- **说明**：`subtitle?` 表示该属性是可选的，并且我们提供了一个默认值 `Default Subtitle`。

### 6. **泛型组件**

有时你可能需要编写一个可以处理不同类型的组件，这时可以使用泛型。

```tsx
import React from 'react';

// 泛型组件定义
interface ListProps<T> {
  items: T[];
  render: (item: T) => React.ReactNode;
}

function List<T>({ items, render }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{render(item)}</li>
      ))}
    </ul>
  );
}

// 使用泛型组件
const App = () => {
  return (
    <List items={['Apple', 'Banana', 'Cherry']} render={(item) => <span>{item}</span>} />
  );
};

export default App;
```

- **说明**：这里我们定义了一个泛型组件 `List`，它可以处理不同类型的 `items`，并且使用泛型 `T` 来定义 `items` 和 `render` 函数的类型。

### 7. **高阶组件（Higher Order Component）**

高阶组件是接受组件作为参数并返回新组件的函数。在 TypeScript 中，我们可以使用泛型为高阶组件的输入和输出组件提供类型。

```tsx
import React, { ComponentType } from 'react';

// 定义一个高阶组件，它为 WrappedComponent 添加额外的功能
function withExtraProps<P>(WrappedComponent: ComponentType<P>) {
  return (props: P) => {
    const extraProp = 'This is an extra prop';
    return <WrappedComponent {...props} extraProp={extraProp} />;
  };
}

// 定义一个普通组件，包含 extraProp
interface MyComponentProps {
  extraProp: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ extraProp }) => {
  return <div>{extraProp}</div>;
};

// 使用高阶组件包装 MyComponent
const EnhancedComponent = withExtraProps(MyComponent);

export default EnhancedComponent;
```

- **说明**：`withExtraProps` 是一个高阶组件，它接受一个组件并返回一个新的组件，新的组件在 `props` 上增加了 `extraProp`。

### 8. **Context 与 TypeScript**

使用 React Context 时，TypeScript 也可以为 `Context` 及其 `Provider` 和 `Consumer` 添加类型。

```tsx
import React, { createContext, useContext } from 'react';

// 创建 Context，指定默认值的类型
interface ThemeContextType {
  color: string;
  toggleColor: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 创建一个使用 Context 的组件
const ThemeButton: React.FC = () => {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error('ThemeButton must be used within a ThemeProvider');

  return <button style={{ backgroundColor: theme.color }} onClick={theme.toggleColor}>Toggle Theme</button>;
};

// 创建一个 Context Provider
const ThemeProvider: React.FC = ({ children }) => {
  const [color, setColor] = React.useState('lightblue');

  const toggleColor = () => {
    setColor(prev => (prev === 'lightblue' ? 'darkblue' : 'lightblue'));
  };

  return (
    <ThemeContext.Provider value={{ color, toggleColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
```

- **说明**：通过 `createContext` 为上下文声明类型，并通过 `useContext` 针对 `Context` 进行类型检查。

---

### 总结

- **函数式组件** 和 **类组件** 都可以结合 TypeScript 使用，为 `Props` 和 `State` 提供类型。
- 常用的 React Hooks（如 `useState` 和 `useEffect`）也可以结合 TypeScript 显式声明类型。
- 高阶组件、泛型组件和 Context 都可以利用 TypeScript 提供强类型支持。

