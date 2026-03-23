import { prisma } from "@/lib/prisma";

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export async function isBakeryAcceptingOrders(currentDate = new Date()) {
  const dayOfWeek = currentDate.getDay();
  const schedule = await prisma.availabilitySchedule.findUnique({
    where: {
      dayOfWeek,
    },
  });

  if (!schedule || schedule.isClosed) {
    return false;
  }

  const nowMinutes = currentDate.getHours() * 60 + currentDate.getMinutes();
  const openMinutes = toMinutes(schedule.openTime);
  const closeMinutes = toMinutes(schedule.closeTime);

  return nowMinutes >= openMinutes && nowMinutes <= closeMinutes;
}
