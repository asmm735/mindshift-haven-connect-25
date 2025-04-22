
import PageLayout from "@/components/layout/PageLayout";
import AIChatComponent from "@/components/features/AIChat/AIChat";

const AIChat = () => {
  return (
    <PageLayout className="container mx-auto px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-mindshift-raspberry mb-2">AI Assistant</h1>
        <p className="text-gray-600 mb-8">Chat with our AI for mental health support and guidance</p>
      
        <AIChatComponent />
      </div>
    </PageLayout>
  );
};

export default AIChat;
