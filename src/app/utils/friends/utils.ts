export const checkFriendRequests = async (userId: string): Promise<any> => {
  const response = await fetch(`/api/user/checkFriendRequests/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  const data = await response.json();
  const { friendRequests } = data;
  return friendRequests;
};
