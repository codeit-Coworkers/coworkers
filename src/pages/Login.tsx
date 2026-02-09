"use client";

import Gnb from "@/components/gnb/Gnb";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form"; // 💡 Controller 추가
import { useSignIn, SignInRequest } from "@/api/auth";
import { Input } from "@/components/common/Input/Input";

export default function LoginPage() {
  const navigate = useNavigate();
  const { mutate: signIn, isPending } = useSignIn();

  const {
    control, // 💡 Controller를 사용하기 위해 control 객체 필요
    handleSubmit,
    formState: { errors },
  } = useForm<SignInRequest>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: SignInRequest) => {
    signIn(data, {
      onSuccess: () => {
        alert("로그인 성공!");
        navigate("/");
      },
      onError: (error) => {
        alert(error.message);
      },
    });
  };

  return (
    <div className="bg-background-secondary flex h-screen w-full overflow-hidden">
      <Gnb />

      <div className="relative flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-[400px]">
          <div className="mb-8 text-center">
            <h1 className="text-color-primary text-2xl font-bold">로그인</h1>
          </div>

          <div className="bg-surface-primary w-full rounded-2xl p-8 shadow-md">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                {/* 💡 이메일: Controller로 감싸서 연결 */}
                <div className="space-y-1">
                  <Controller
                    name="email"
                    control={control}
                    rules={{ required: "이메일을 입력해주세요." }}
                    render={({ field }) => (
                      <Input
                        {...field} // field 안의 onChange, onBlur, value 등이 주입됨
                        label="이메일"
                        type="email"
                        placeholder="email@example.com"
                        className={errors.email ? "border-status-danger" : ""}
                      />
                    )}
                  />
                  {errors.email && (
                    <p className="text-status-danger text-xs">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* 💡 비밀번호: Controller로 감싸서 연결 */}
                <div className="space-y-1">
                  <Controller
                    name="password"
                    control={control}
                    rules={{ required: "비밀번호를 입력해주세요." }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="비밀번호"
                        type="password"
                        placeholder="비밀번호를 입력하세요"
                        className={
                          errors.password ? "border-status-danger" : ""
                        }
                      />
                    )}
                  />
                  {errors.password && (
                    <p className="text-status-danger text-xs">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <button
                disabled={isPending}
                type="submit"
                className="bg-brand-primary hover:bg-opacity-90 h-[48px] w-full rounded-lg font-bold text-white transition-all disabled:bg-gray-300"
              >
                {isPending ? "로그인 중..." : "로그인하기"}
              </button>
            </form>

            <div className="mt-6 flex justify-center gap-2 text-sm">
              <span className="text-color-secondary">계정이 없으신가요?</span>
              <Link
                to="/signup"
                className="text-brand-primary font-bold hover:underline"
              >
                회원가입
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
