import type { Unit } from '@prisma/client';
import { ImageInput } from '@/components/admin/ImageInput';
import { CheckboxField, Field, SelectField, TextAreaField } from '@/components/ui/Field';
import { mn } from '@/i18n/mn';

export type EditableService = {
  id: string;
  name: string;
  description: string | null;
  unit: Unit;
  price: number | null;
  sortOrder: number;
  isVisible: boolean;
  image: { key: string } | null;
};

/** Үйлчилгээ нэмэх ба засах маягтын нийтлэг талбарууд */
export function ServiceFields({ service }: { service?: EditableService }) {
  const id = (name: string) => `${service?.id ?? 'new'}-${name}`;
  return (
    <>
      <div className="row">
        <Field
          label="Нэр"
          name="name"
          id={id('name')}
          defaultValue={service?.name}
          required
          maxLength={80}
        />
        <SelectField
          label="Хэмжих нэгж"
          name="unit"
          id={id('unit')}
          options={mn.units}
          defaultValue={service?.unit}
        />
      </div>
      <div className="row">
        <Field
          label="Нэгж үнэ (₮) — хоосон бол «Үнэ тохирно»"
          name="price"
          id={id('price')}
          inputMode="numeric"
          defaultValue={service?.price != null ? service.price / 100 : ''}
        />
        <Field
          label="Дараалал (бага нь эхэнд)"
          name="sortOrder"
          id={id('sortOrder')}
          type="number"
          min={0}
          max={999}
          defaultValue={service?.sortOrder ?? 0}
        />
      </div>
      <TextAreaField
        label="Товч тайлбар"
        name="description"
        id={id('description')}
        maxLength={300}
        defaultValue={service?.description ?? ''}
      />
      <ImageInput id={id('image')} current={service?.image} removable />
      <CheckboxField
        name="isVisible"
        label="Сайтад харуулах"
        defaultChecked={service?.isVisible ?? true}
      />
    </>
  );
}
