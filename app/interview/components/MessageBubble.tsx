export default function MessageBubble({ msg }: any) {
    const isUser = msg.role === "user";
    const clean = msg.content
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/#/g, "")
    .replace(/`/g, "");
    
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-2 rounded-2xl max-w-xl text-sm shadow-sm ${
          isUser
            ? "bg-blue-500 text-white rounded-br-md"
            : "bg-white border text-gray-800 rounded-bl-md"
        }`}
      >
        {clean}
      </div>
    </div>
  );
}