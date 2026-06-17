import { supabase } from "../../lib/supabase";

type SignUpParams = {
  email: string;
  password: string;
  shopName: string;
  ownerName: string;
};

type SignInParams = {
  email: string;
  password: string;
};

export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return data.session;
}

export async function signInWithEmail({ email, password }: SignInParams) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signUpWithEmail({
  email,
  ownerName,
  password,
  shopName,
}: SignUpParams) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  if (!data.user) {
    throw new Error("회원가입 사용자 정보를 확인할 수 없습니다.");
  }

  if (!data.session) {
    return {
      ...data,
      profileCreated: false,
      requiresEmailConfirmation: true,
    };
  }

  const { error: profileError } = await supabase.from("profiles").insert({
    id: data.user.id,
    shop_name: shopName,
    owner_name: ownerName,
    default_revisit_interval_days: 28,
  });

  if (profileError) {
    throw profileError;
  }

  return {
    ...data,
    profileCreated: true,
    requiresEmailConfirmation: false,
  };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}
