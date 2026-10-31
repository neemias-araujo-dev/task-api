"use client";

import { api } from "@/trpc/react";

export function TaskApiTest() {
  const { data, isLoading, error } = api.task.getAll.useQuery();

  if (isLoading) {
    return <p>Loading tasks...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <h1>Task Manager API Test</h1>

      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}