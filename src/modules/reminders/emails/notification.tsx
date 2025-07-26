interface NotificationEmailProps {
  name: string;
}

export const NotificationEmail = ({ name }: NotificationEmailProps) => {
  return (
    <div>
      <h1>Welcome, {name}!</h1>
    </div>
  );
};
