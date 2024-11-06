import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ImageLineage } from '../types';

interface Props {
  lineage: ImageLineage;
}

export default function ImageLineageView({ lineage }: Props) {
  const { parent, current, children } = lineage;

  return (
    <div className="space-y-6">
      {/* Parent relationship */}
      {parent && (
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 shrink-0">
            <img
              src={parent.url}
              alt={parent.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <ArrowRight className="w-6 h-6 text-gray-400" />
          <div className="w-24 h-24 shrink-0">
            <img
              src={current.url}
              alt={current.title}
              className="w-full h-full object-cover rounded-lg ring-2 ring-blue-500"
            />
          </div>
          <div>
            <p className="font-medium">Derived from</p>
            <p className="text-sm text-gray-600">{parent.title}</p>
          </div>
        </div>
      )}

      {/* Children */}
      {children.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium">Variations</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {children.map((child) => (
              <div key={child.id} className="space-y-2">
                <div className="aspect-square">
                  <img
                    src={child.url}
                    alt={child.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <p className="text-sm truncate">{child.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}