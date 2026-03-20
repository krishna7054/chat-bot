import ChatWindow from "./components/ChatWindow";

type InterviewPageProps = {
  searchParams: Promise<{
    role?: string | string[];
  }>;
};

export default async function Page({ searchParams }: InterviewPageProps) {
  const params = await searchParams;
  const roleValue = params.role;
  const role =
    typeof roleValue === "string"
      ? roleValue
      : Array.isArray(roleValue) && roleValue.length > 0
        ? roleValue[0]
        : "frontend";

  return <ChatWindow role={role} />;
}
