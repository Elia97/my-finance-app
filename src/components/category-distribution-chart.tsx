import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CategoryChart } from "@/components/charts/category-chart";
import { getCategoryDistribution } from "@/lib/queries/category-distribution";

export async function CategoryDistributionChart() {
  const data = await getCategoryDistribution();
  const chartData = data.map((category) => ({
    name: category.name,
    value: Number(category.value),
    color: category.color,
  }));
  return (
    <Card>
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
