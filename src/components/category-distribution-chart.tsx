import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CategoryChart } from "@/components/charts/category-chart";
import { getCategoryDistribution } from "@/lib/queries/category-distribution";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function CategoryDistributionChart() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!session || !userId) {
    return <div>Accesso negato</div>;
  }

  const data = await getCategoryDistribution(userId);
  const chartData = data.map((category) => ({
    name: category.name,
    value: Number(category.value),
    color: category.color,
  }));

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Distribuzione Spese</CardTitle>
          <CardDescription>Nessuna spesa registrata</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">
            Non hai ancora registrato spese. Inizia aggiungendo una nuova spesa.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-2 xl:col-span-1">
      <CardHeader>
        <CardTitle>Distribuzione Spese</CardTitle>
        <CardDescription>
          Suddivisione delle spese per categoria
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CategoryChart data={chartData} />
      </CardContent>
    </Card>
  );
}
