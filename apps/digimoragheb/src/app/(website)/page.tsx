import { useAuthContext } from "@workspace/custom-ui/hooks/use-auth";

export default function Home() {
  const { }=useAuthContext()
  return <div>
    <p className="global-title-md">Home Page</p>
    <p className="global-description-md">Home Page</p>
  </div>;
}