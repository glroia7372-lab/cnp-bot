"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

function getKoreanErrorMessage(message: string): string {
    if (message.includes("Invalid login credentials")) {
        return "이메일 또는 비밀번호가 올바르지 않습니다.";
    }
    if (message.includes("User already registered") || message.includes("user_already_exists")) {
        return "이미 가입된 이메일 주소입니다.";
    }
    if (message.includes("Password should be at least")) {
        return "비밀번호는 최소 6자 이상이어야 합니다.";
    }
    if (message.includes("Email not confirmed")) {
        return "이메일 인증이 완료되지 않았습니다. 메일함을 확인해 주세요.";
    }
    if (message.includes("Unable to validate email address") || message.includes("invalid format")) {
        return "올바른 이메일 형식이 아닙니다.";
    }
    if (message.includes("rate limit") || message.includes("Too many requests")) {
        return "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.";
    }
    return message;
}

export async function login(formData: FormData) {
    const supabase = await createClient();

    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        redirect(`/login?error=${encodeURIComponent(getKoreanErrorMessage(error.message))}`);
    }

    revalidatePath("/", "layout");
    redirect("/");
}

export async function signup(formData: FormData) {
    const supabase = await createClient();

    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    const { error } = await supabase.auth.signUp(data);

    if (error) {
        redirect(`/login?error=${encodeURIComponent(getKoreanErrorMessage(error.message))}`);
    }

    revalidatePath("/", "layout");
    redirect("/login?registered=true");
}

export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();

    revalidatePath("/", "layout");
    redirect("/login");
}

export async function updatePassword(formData: FormData) {
    const supabase = await createClient();
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.updateUser({
        password: password
    });

    if (error) {
        return { error: error.message };
    }

    return { success: true };
}

export async function updatePreferences(preferences: any) {
    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({
        data: { preferences }
    });

    if (error) {
        return { error: error.message };
    }

    return { success: true };
}
