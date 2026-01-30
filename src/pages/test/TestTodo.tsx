import React, { useState } from "react";
// 통합된 Todo 컴포넌트를 불러옵니다. 경로를 확인해 주세요!
import Todo from "@/components/common/Todo/todo";

const TestTodo = () => {
  // 테스트를 위해 모바일용과 웹용 데이터를 각각 관리합니다.
  const [mobileTodos, setMobileTodos] = useState([
    { id: 1, content: "법인 설립 안내 드리기", isCompleted: false },
    { id: 2, content: "법인 설립 안내 드리기", isCompleted: true },
  ]);

  const [webTodos, setWebTodos] = useState([
    { id: 1, content: "법인 설립 안내 드리기", isCompleted: false },
    { id: 2, content: "법인 설립 안내 드리기", isCompleted: true },
  ]);

  // 각각의 토글 함수
  const toggleMobile = (id: number) => {
    setMobileTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, isCompleted: !t.isCompleted } : t,
      ),
    );
  };

  const toggleWeb = (id: number) => {
    setWebTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, isCompleted: !t.isCompleted } : t,
      ),
    );
  };

  return (
    <div className="flex flex-col items-center gap-12 bg-[#444444] p-10">
      <div className="h-62.5 w-full max-w-63.25 rounded-xl border border-dashed border-indigo-500/50 bg-[#444444] p-6">
        <div className="flex flex-col pl-5.75">
          {mobileTodos.map((todo) => (
            <Todo
              key={`mobile-${todo.id}`}
              content={todo.content}
              isCompleted={todo.isCompleted}
              onToggle={() => toggleMobile(todo.id)}
              // isWeb을 안 넣으면 기본값인 false가 적용됩니다.
            />
          ))}
        </div>
        <div className="mt-5 flex flex-col pl-5">
          {webTodos.map((todo) => (
            <Todo
              key={`web-${todo.id}`}
              content={todo.content}
              isCompleted={todo.isCompleted}
              onToggle={() => toggleWeb(todo.id)}
              isWeb={true} // 웹용 크기와 간격을 적용합니다.
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestTodo;
