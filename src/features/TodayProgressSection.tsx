type GroupProps = {
  id: number;
  name: string;
};

export default function TodayProgressSection({ id, name }: GroupProps) {
  return (
    <div>
      {name}
      {id}
    </div>
  );
}
