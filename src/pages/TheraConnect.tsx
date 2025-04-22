
import PageLayout from "@/components/layout/PageLayout";
import TheraConnectComponent from "@/components/features/TheraConnect/TheraConnect";

const TheraConnect = () => {
  return (
    <PageLayout className="container mx-auto px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-mindshift-raspberry mb-2">TheraConnect</h1>
        <p className="text-gray-600 mb-8">Find and connect with mental health professionals in your area</p>
      
        <TheraConnectComponent />
      </div>
    </PageLayout>
  );
};

export default TheraConnect;
