"use client";

import { ExperienceForm } from "./experience-form";
import { SlotsManager } from "./slots-manager";
import { PhotosEditor } from "@/features/places/components/photos-editor";
import { useAddExperiencePhoto } from "@/features/experiences/hooks/use-manage-experiences";
import type { ExperienceDetail } from "@/lib/api/types";

export function ExperienceEditor({
  experience,
  onClose,
}: {
  experience: ExperienceDetail;
  onClose: () => void;
}) {
  const addPhoto = useAddExperiencePhoto(experience.id);

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h4 className="text-sm font-semibold tracking-tight mb-3">Datos</h4>
        <ExperienceForm
          existing={experience}
          onSuccess={onClose}
          onCancel={onClose}
        />
      </section>

      <div className="border-t border-[var(--border)]" />

      <section>
        <h4 className="text-sm font-semibold tracking-tight mb-3">
          Cupos y horarios
        </h4>
        <SlotsManager experienceId={experience.id} />
      </section>

      <div className="border-t border-[var(--border)]" />

      <section>
        <h4 className="text-sm font-semibold tracking-tight mb-3">Fotos</h4>
        <PhotosEditor
          photos={experience.photos ?? []}
          onAdd={(p) => addPhoto.mutateAsync(p)}
          adding={addPhoto.isPending}
        />
      </section>
    </div>
  );
}
