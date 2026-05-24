import React, { useState } from 'react';
import toast from 'react-hot-toast';

const defaultLinks = [
  { platform: '', url: '' },
];

export default function CreatorProfileForm({ user, onSave }) {
  const [banner, setBanner] = useState(user.banner || '');
  const [bio, setBio] = useState(user.bio || '');
  const [socialLinks, setSocialLinks] = useState(user.socialLinks?.length ? user.socialLinks : defaultLinks);
  const [saving, setSaving] = useState(false);

  const handleLinkChange = (idx, field, value) => {
    setSocialLinks(links => links.map((l, i) => i === idx ? { ...l, [field]: value } : l));
  };

  const addLink = () => setSocialLinks([...socialLinks, { platform: '', url: '' }]);
  const removeLink = idx => setSocialLinks(links => links.filter((_, i) => i !== idx));

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({ banner, bio, socialLinks: socialLinks.filter(l => l.platform && l.url) });
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6 mb-8 space-y-4">
      <h2 className="text-lg font-bold mb-2 text-stone-900 dark:text-white">Customize Your Storefront</h2>
      <div>
        <label className="block font-medium text-sm text-stone-700 dark:text-stone-300 mb-1.5">Banner Image URL</label>
        <input
          type="url"
          className="input-field"
          value={banner}
          onChange={e => setBanner(e.target.value)}
          placeholder="https://..."
        />
        {banner && <img src={banner} alt="Banner preview" className="mt-2 h-24 w-full object-cover rounded" />}
      </div>
      <div>
        <label className="block font-medium text-sm text-stone-700 dark:text-stone-300 mb-1.5">Bio</label>
        <textarea
          className="input-field"
          value={bio}
          onChange={e => setBio(e.target.value)}
          rows={3}
          maxLength={500}
        />
      </div>
      <div>
        <label className="block font-medium text-sm text-stone-700 dark:text-stone-300 mb-1.5">Social Links</label>
        <div className="space-y-3">
          {socialLinks.map((link, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                type="text"
                className="input-field py-2"
                placeholder="Platform (e.g. Twitter)"
                value={link.platform}
                onChange={e => handleLinkChange(idx, 'platform', e.target.value)}
              />
              <input
                type="url"
                className="input-field py-2"
                placeholder="URL"
                value={link.url}
                onChange={e => handleLinkChange(idx, 'url', e.target.value)}
              />
              <button type="button" className="text-red-500 hover:text-red-600 px-3 py-2 bg-red-50 dark:bg-red-500/10 rounded-lg transition-colors" onClick={() => removeLink(idx)} disabled={socialLinks.length === 1}>&times;</button>
            </div>
          ))}
          <button type="button" className="text-brand-500 hover:text-brand-600 font-medium text-sm flex items-center gap-1" onClick={addLink}>+ Add Link</button>
        </div>
      </div>
      <div className="pt-2">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Profile'}</button>
      </div>
    </form>
  );
}
