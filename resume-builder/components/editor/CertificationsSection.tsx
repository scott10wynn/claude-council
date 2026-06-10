'use client';

import { useResumeStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

export function CertificationsSection() {
  const { data, addCertification, updateCertification, removeCertification } = useResumeStore();

  return (
    <div className="space-y-3">
      {data.certifications.map((cert) => (
        <div key={cert.id} className="rounded-lg border border-gray-200 bg-white p-3 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 grid grid-cols-2 gap-2">
              <div className="col-span-2">
                <Input label="Certification Name" value={cert.name} placeholder="AWS Solutions Architect" onChange={(e) => updateCertification(cert.id, 'name', e.target.value)} />
              </div>
              <Input label="Issuing Organization" value={cert.issuer} placeholder="Amazon Web Services" onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)} />
              <Input label="Date Earned" type="month" value={cert.date} onChange={(e) => updateCertification(cert.id, 'date', e.target.value)} />
              <Input label="Expiry (optional)" type="month" value={cert.expiry ?? ''} onChange={(e) => updateCertification(cert.id, 'expiry', e.target.value)} />
              <Input label="Credential URL (optional)" value={cert.url ?? ''} placeholder="https://..." onChange={(e) => updateCertification(cert.id, 'url', e.target.value)} />
            </div>
            <Button variant="ghost" size="icon" onClick={() => removeCertification(cert.id)} className="text-red-400 hover:text-red-600 mt-5 shrink-0">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addCertification} className="w-full border-dashed">
        <Plus className="h-4 w-4" /> Add Certification
      </Button>
    </div>
  );
}
