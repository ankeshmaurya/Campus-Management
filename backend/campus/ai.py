from __future__ import annotations

from dataclasses import dataclass

from .models import Classroom


@dataclass
class ClassroomSuggestion:
    classroom_id: int
    classroom_name: str
    block_name: str
    seating_capacity: int
    current_strength: int
    expected_utilization_percent: float


def suggest_classroom(enrolled_students: int, prefer_smart: bool = False) -> ClassroomSuggestion | None:
    qs = Classroom.objects.select_related("block").all()
    if prefer_smart:
        qs = qs.filter(is_smart_class=True)

    best = None
    best_score = None

    for room in qs:
        if room.seating_capacity <= 0:
            continue

        expected_util = (enrolled_students / room.seating_capacity) * 100

        # Score is distance from ideal utilization (80%), with a penalty if overloaded.
        score = abs(expected_util - 80)
        if expected_util > 100:
            score += 1000

        if best_score is None or score < best_score:
            best_score = score
            best = room

    if not best:
        return None

    expected_util = (enrolled_students / best.seating_capacity) * 100 if best.seating_capacity else 0.0

    return ClassroomSuggestion(
        classroom_id=best.id,
        classroom_name=best.classroom_name,
        block_name=best.block.block_name,
        seating_capacity=best.seating_capacity,
        current_strength=best.current_strength,
        expected_utilization_percent=expected_util,
    )
