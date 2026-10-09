'use client';

import { useTranslations } from 'next-intl';
import { useActionState } from 'react';
import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Checkbox, Field, Input, Select } from '@/components/ui/Field';
import { FormErrors } from '@/components/ui/FormErrors';
import { SubmitButton } from '@/components/ui/SubmitButton';
import type { FormState } from '@/lib/form';
import type { Restaurant } from '@/types/api';

interface RestaurantFormProps {
    action: (state: FormState, formData: FormData) => Promise<FormState>;
    restaurant?: Restaurant;
    timeZones: string[];
    cancelHref: string;
}

export function RestaurantForm({ action, restaurant, timeZones, cancelHref }: RestaurantFormProps) {
    const t = useTranslations('admin.restaurants');
    const tc = useTranslations('common');
    const [state, formAction] = useActionState(action, {});
    const value = (field: keyof Restaurant) => state.values?.[field] ?? String(restaurant?.[field] ?? '');

    return (
        <Card>
            <form action={formAction} className="space-y-5">
                <FormErrors errors={state.errors} />

                <div className="grid gap-5 sm:grid-cols-2">
                    <Field label={t('fields.name')} htmlFor="name">
                        <Input id="name" name="name" required maxLength={120} defaultValue={value('name')} autoFocus />
                    </Field>
                    <Field label={t('fields.slug')} htmlFor="slug" hint={t('slugHint')}>
                        <Input
                            id="slug"
                            name="slug"
                            maxLength={60}
                            pattern="[a-z0-9]+(-[a-z0-9]+)*"
                            defaultValue={value('slug')}
                        />
                    </Field>
                    <Field label={t('fields.address')} htmlFor="address">
                        <Input id="address" name="address" maxLength={200} defaultValue={value('address')} />
                    </Field>
                    <Field label={t('fields.city')} htmlFor="city">
                        <Input id="city" name="city" maxLength={200} defaultValue={value('city')} />
                    </Field>
                    <Field label={t('fields.phone')} htmlFor="phone">
                        <Input id="phone" name="phone" type="tel" maxLength={40} defaultValue={value('phone')} />
                    </Field>
                    <Field label={t('fields.email')} htmlFor="email">
                        <Input id="email" name="email" type="email" defaultValue={value('email')} />
                    </Field>
                    <Field label={t('fields.latitude')} htmlFor="latitude">
                        <Input
                            id="latitude"
                            name="latitude"
                            type="number"
                            step="any"
                            min={-90}
                            max={90}
                            defaultValue={value('latitude')}
                        />
                    </Field>
                    <Field label={t('fields.longitude')} htmlFor="longitude">
                        <Input
                            id="longitude"
                            name="longitude"
                            type="number"
                            step="any"
                            min={-180}
                            max={180}
                            defaultValue={value('longitude')}
                        />
                    </Field>
                    <Field label={t('fields.timeZone')} htmlFor="time_zone">
                        <Select id="time_zone" name="time_zone" defaultValue={value('time_zone') || 'Europe/Sarajevo'}>
                            {timeZones.map((zone) => (
                                <option key={zone} value={zone}>
                                    {zone}
                                </option>
                            ))}
                        </Select>
                    </Field>
                    <div className="flex items-end pb-2">
                        <Checkbox
                            name="has_host"
                            label={t('fields.hasHost')}
                            defaultChecked={
                                state.values ? state.values.has_host === 'on' : (restaurant?.has_host ?? false)
                            }
                        />
                    </div>
                </div>

                <div className="flex gap-3">
                    <SubmitButton>{tc('save')}</SubmitButton>
                    <ButtonLink variant="secondary" href={cancelHref}>
                        {tc('cancel')}
                    </ButtonLink>
                </div>
            </form>
        </Card>
    );
}
