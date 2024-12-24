'use client'

import { useRole } from '@/hooks/role-provider';

const Home = () => {
  const { role, subscriptionPlan, aiGenerationLimit } = useRole();

  return (
    <div>
      <h1>Welcome Home</h1>
      <p>Your Role: {role ?? 'Not set'}</p> {/* Default message when role is null */}
      <p>Your Subscription Plan: {subscriptionPlan ?? 'Not set'}</p> {/* Default message when subscriptionPlan is null */}
      <p>Your AI Generation Limit: {aiGenerationLimit ?? 'Not set'}</p> {/* Default message when aiGenerationLimit is null */}
    </div>
  );
};

export default Home;
